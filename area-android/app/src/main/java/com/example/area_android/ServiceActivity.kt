package com.example.area_android

import android.content.Intent
import android.net.Uri
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result

class ServiceActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_service)

        val app = this.application as AreaApplication
        val serviceName = intent.getStringExtra("service")

        val name = findViewById<TextView>(R.id.serviceName)
        val desc = findViewById<TextView>(R.id.serviceDescription)

        val add = findViewById<Button>(R.id.add)
        val modify = findViewById<Button>(R.id.modify)
        val delete = findViewById<Button>(R.id.delete)

        val url = app.serverUrl + "/services/" + serviceName
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                    }
                    is Result.Success -> {
                        val data = result.get().obj().getJSONObject("data")
                        name.text = data.getString("displayName")
                        desc.text = data.getString("description")
                    }
                }
            }

        Fuel.get(app.serverUrl + "/me/services")
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                val data = result.get().obj().getJSONObject("data")
                println("me services")
                println(data)
                if (data.has(serviceName)) {
                    add.isEnabled = false
                } else {
                    modify.isEnabled = false
                    delete.isEnabled = false
                }
            }

        add.setOnClickListener{
            this.redirectToService(serviceName)
        }

        delete.setOnClickListener {
            Fuel.delete(app.serverUrl + "/me/services/" + serviceName)
                .authentication()
                .bearer(app.token!!)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Success -> {
                            add.isEnabled = true
                            modify.isEnabled = false
                            delete.isEnabled = false
                            Toast.makeText(this, "Service deleted", Toast.LENGTH_SHORT).show()
                        }
                        is Result.Failure -> {
                            Toast.makeText(this, "Cannot delete service", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
        }
    }

    private fun redirectToService(serviceName: String) {
        val app = this.application as AreaApplication

        if (serviceName == "dropbox") {
            val intent = Intent(this, DropboxAuthActivity::class.java)

            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            this.finish()
            return
        }


        val url = app.serverUrl + "/auth/oauth/authorize_url/$serviceName/android"
        Fuel.get(url)
            .responseJson { request, response, result ->
                val data = result.get().obj().getString("data")

                app.redirectAction = AreaApplication.ActionType.AddService
                val webpage: Uri = Uri.parse(data)
                val intent = Intent(Intent.ACTION_VIEW, webpage)
                startActivity(intent)
                finish()
            }
    }
}
