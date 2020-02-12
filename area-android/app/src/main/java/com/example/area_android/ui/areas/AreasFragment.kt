package com.example.area_android.ui.areas

import android.content.Intent
import android.graphics.Color
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isEmpty
import androidx.core.view.size
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.NewAreaActivity
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import com.google.android.material.floatingactionbutton.FloatingActionButton
import kotlinx.android.synthetic.main.fragment_areas.*
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class AreasFragment : Fragment() {

    private lateinit var areasViewModel: AreasViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        areasViewModel =
            ViewModelProviders.of(this).get(AreasViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_areas, container, false)

        val app = this.activity!!.application as AreaApplication

        val addServiceButton = root.findViewById<FloatingActionButton>(R.id.addServiceButton)

        addServiceButton.setOnClickListener {
            val intent = Intent(this.activity, NewAreaActivity::class.java);
            startActivityForResult(intent, 0)
        }

        return root
    }
}