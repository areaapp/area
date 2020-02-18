package com.example.area_android

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.core.view.children
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.gson.Gson
import com.google.gson.internal.LinkedTreeMap
import com.google.gson.reflect.TypeToken
import org.json.JSONObject

class NewAreaActivity : AppCompatActivity() {

    var app: AreaApplication? = null
    private var services: HashMap<String, Any>? = null
    private var userActions: ArrayList<Map<String, Any>> = ArrayList()
    private var userReactions: ArrayList<Map<String, Any>> = ArrayList()

    private var selectedAction: Map<String, Any>? = null
    private var selectedReaction: Map<String, Any>? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_new_area)

        app = this.application as AreaApplication

        val chooseActionButton = findViewById<ImageButton>(R.id.chooseActionButton)
        val chooseReactionButton = findViewById<ImageButton>(R.id.chooseReactionButton)

        Fuel.get(app!!.serverUrl + "/services")
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this, "Request failed", Toast.LENGTH_SHORT).show()
                    }
                    is Result.Success -> {
                        val tmp: String = result.get().obj().getJSONObject("data").toString(0)
                        services = Gson().fromJson<Any>(
                            tmp,
                            object : TypeToken<HashMap<String, Any>>() {}.type
                        ) as HashMap<String, Any>

                        this.getUserActionsReactions()
                    }
                }
            }
        
        chooseActionButton.setOnClickListener {
            this.openActionDialog()
        }
        chooseReactionButton.setOnClickListener {
            this.openReactionDialog()
        }

        val cancelButton = findViewById<Button>(R.id.cancelButton)
        cancelButton.setOnClickListener {
            finish()
        }

        val addButton = findViewById<Button>(R.id.addButton)
        addButton.setOnClickListener {
            val actionArgsLayout = findViewById<LinearLayout>(R.id.actionArgsLayout)
            val reactionArgsLayout = findViewById<LinearLayout>(R.id.reactionArgsLayout)
            val areaName = findViewById<EditText>(R.id.name)

            val requestData = hashMapOf<String, Any?>(
                "name" to areaName.text.toString()
            )

            val actionObject = hashMapOf(
                "name" to this.selectedAction!!["name"]
            )
            val actionArgsObject = HashMap<String, Any>()
            actionArgsLayout.children.forEachIndexed { index, view ->
                view as EditText
                val paramName = view.tag.toString().substring(7)
                val paramValue = view.text.toString()
                actionArgsObject[paramName] = paramValue
            }
            actionObject["params"] = actionArgsObject

            val reactionObject = hashMapOf(
                "name" to this.selectedReaction!!["name"]
            )
            val reactionArgsObject = HashMap<String, Any>()
            reactionArgsLayout.children.forEachIndexed { index, view ->
                view as EditText
                val paramName = view.tag.toString().substring(9)
                val paramValue = view.text.toString()
                reactionArgsObject[paramName] = paramValue
            }
            reactionObject["params"] = reactionArgsObject

            requestData["action"] = actionObject
            requestData["reaction"] = reactionObject

            println(JSONObject(requestData).toString())

            Fuel.post(app!!.serverUrl + "/me/area")
                .authentication()
                .bearer(app!!.token!!)
                .jsonBody(JSONObject(requestData).toString())
                .responseJson { request, response, result ->
                    when(result) {
                        is Result.Failure -> {
                            println(result.error)
                            Toast.makeText(this, "Failed", Toast.LENGTH_SHORT).show()
                        }
                        is Result.Success -> {
                            Toast.makeText(this, "Success", Toast.LENGTH_SHORT).show()
                            setResult(Activity.RESULT_OK)
                            finish()
                        }
                    }
                }
        }
    }

    private fun getUserActionsReactions() {
        Fuel.get(app!!.serverUrl + "/me/services")
            .authentication()
            .bearer(app!!.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        Toast.makeText(this, "Request failed", Toast.LENGTH_SHORT).show()
                    }
                    is Result.Success -> {
                        val data = result.get().obj().getJSONObject("data")
                        val iter: MutableIterator<String> = data.keys()
                        while (iter.hasNext()) {
                            val serviceName = iter.next()

                            val service = services!![serviceName] as LinkedTreeMap<String, Any>
                            val serviceActions =
                                service["actions"] as ArrayList<LinkedTreeMap<String, Any>>
                            for (i in 0 until serviceActions.size) {
                                val a = serviceActions[i]
                                a["service"] = serviceName
                                userActions.add(a.toMap())
                            }

                            val serviceReactions =
                                service["reactions"] as ArrayList<LinkedTreeMap<String, Any>>
                            for (i in 0 until serviceReactions.size) {
                                println(serviceReactions[i]["name"] as String)
                                val r = serviceReactions[i]
                                r["service"] = serviceName
                                userReactions.add(r.toMap())
                            }
                        }
                    }
                }
            }
    }

    private fun openActionDialog() {
        val actionNameText = findViewById<TextView>(R.id.areaName)
        val adapter = this.getActionsAdapter()
        val listView = ListView(this)
        val dialog = AlertDialog.Builder(this)
            .setTitle("Select an action")
            .setView(listView)
            .setNegativeButton("Cancel", null)
            .create()

        listView.adapter = adapter

        listView.setOnItemClickListener { parent, view, position, id ->
            this.selectedAction = userActions[id.toInt()]
            actionNameText.text = userActions[id.toInt()]["displayName"] as String
            dialog.dismiss()
            this.setActionArgs(userActions[id.toInt()])
        }

        dialog.show()
    }

    private fun getActionsAdapter(): SimpleAdapter {
        val actionTexts: MutableList<Map<String, String>> = ArrayList()
        for (i in 0 until userActions.size) {
            val value = userActions[i]
            val datum: MutableMap<String, String> = HashMap()
            datum["First Line"] = value["displayName"] as String
            datum["Second Line"] = value["description"] as String
            actionTexts.add(datum)
        }

        return SimpleAdapter(this,
            actionTexts,
            android.R.layout.simple_list_item_2,
            arrayOf("First Line", "Second Line"),
            intArrayOf(android.R.id.text1, android.R.id.text2)
        )
    }

    private fun openReactionDialog() {
        val actionNameText = findViewById<TextView>(R.id.reactionName)
        val adapter = this.getReactionsAdapter()
        val listView = ListView(this)
        val dialog = AlertDialog.Builder(this)
            .setTitle("Select a reaction")
            .setView(listView)
            .setNegativeButton("Cancel", null)
            .create()

        listView.adapter = adapter

        listView.setOnItemClickListener { parent, view, position, id ->
            this.selectedReaction = userReactions[id.toInt()]
            actionNameText.text = userReactions[id.toInt()]["displayName"] as String
            dialog.dismiss()
            this.setReactionArgs(userReactions[id.toInt()])
        }

        dialog.show()
    }

    private fun getReactionsAdapter(): SimpleAdapter {
        val actionTexts: MutableList<Map<String, String>> = ArrayList()
        for (i in 0 until userReactions.size) {
            val value = userReactions[i]
            val datum: MutableMap<String, String> = HashMap()
            datum["First Line"] = value["displayName"] as String
            datum["Second Line"] = value["description"] as String
            actionTexts.add(datum)
        }

        return SimpleAdapter(this,
            actionTexts,
            android.R.layout.simple_list_item_2,
            arrayOf("First Line", "Second Line"),
            intArrayOf(android.R.id.text1, android.R.id.text2)
        )
    }

    private fun setActionArgs(action: Map<String, Any>) {
        val argsLayout = findViewById<LinearLayout>(R.id.actionArgsLayout)
        val args = action["params"] as LinkedTreeMap<String, Any>

        argsLayout.removeAllViews()
        args.forEach { (key, value) ->
            val e = EditText(this)
            e.hint = key
            e.tag = "action_$key"
            argsLayout.addView(e)
        }
    }

    private fun setReactionArgs(reaction: Map<String, Any>) {
        val argsLayout = findViewById<LinearLayout>(R.id.reactionArgsLayout)
        val args = reaction["params"] as LinkedTreeMap<String, Any>

        argsLayout.removeAllViews()
        args.forEach { (key, value) ->
            val e = EditText(this)
            e.hint = key
            e.tag = "reaction_$key"
            argsLayout.addView(e)
        }
    }
}
